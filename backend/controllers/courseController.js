const Course = require('../models/Course');
const response = require('../helpers/response');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const videoService = require('../services/videoService');

/**
 * Cloudinary asset destruction helper
 */
const destroyCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId || publicId.startsWith('local_')) return;
  if (isCloudinaryConfigured && cloudinary) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.error(`Error deleting ${resourceType} (${publicId}) from Cloudinary:`, err.message);
    }
  }
};

// GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const { category, search, publishedOnly } = req.query;
    const filter = {};

    if (publishedOnly === 'true') {
      filter.isPublished = { $ne: false };
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .select('title slug description instructor duration price discount rating thumbnail thumbnailPublicId category benefits isPublished createdAt sections')
      .sort('-createdAt');

    return response.success(res, courses, 'Courses fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:slug
const getCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug });

    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    const sanitizedSections = course.sections.map(section => ({
      _id: section._id,
      title: section.title,
      lessons: section.lessons.map(lesson => ({
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        videoProvider: lesson.videoProvider || (lesson.googleDriveFileId ? 'google-drive' : 'external'),
        googleDriveFileId: lesson.googleDriveFileId || '',
        videoUrl: lesson.videoUrl || '',
        videoDuration: lesson.videoDuration,
        videoSize: lesson.videoSize,
        videoFormat: lesson.videoFormat,
        thumbnail: lesson.thumbnail || '',
        isPreview: !!lesson.isPreview
      }))
    }));

    const sanitizedCourse = course.toObject();
    sanitizedCourse.sections = sanitizedSections;

    return response.success(res, sanitizedCourse, 'Course details fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/courses (Admin Only)
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      instructor,
      duration,
      price,
      discount,
      category,
      benefits,
      faqs,
      thumbnail,
      thumbnailPublicId,
      isPublished
    } = req.body;
    
    // Auto generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const courseExists = await Course.findOne({ slug });
    if (courseExists) {
      return response.error(res, 'Course with this title slug already exists', 400);
    }

    const course = await Course.create({
      title,
      slug,
      description,
      instructor: instructor || 'Dhan Vijeta Team',
      duration: duration || '0 hours',
      price,
      discount: discount || 0,
      category,
      benefits: benefits || [],
      faqs: faqs || [],
      thumbnail: thumbnail || '',
      thumbnailPublicId: thumbnailPublicId || '',
      sections: [],
      isPublished: isPublished !== undefined ? isPublished : true
    });

    return response.success(res, course, 'Course created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id (Admin Only)
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Clean up old thumbnail from Cloudinary if replaced
    if (updates.thumbnailPublicId && course.thumbnailPublicId && updates.thumbnailPublicId !== course.thumbnailPublicId) {
      await destroyCloudinaryAsset(course.thumbnailPublicId, 'image');
    }

    Object.assign(course, updates);
    await course.save();

    return response.success(res, course, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id (Admin Only)
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Clean up course thumbnail
    if (course.thumbnailPublicId) {
      await destroyCloudinaryAsset(course.thumbnailPublicId, 'image');
    }

    // Clean up all video and thumbnail assets across sections & lessons
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.videoPublicId) {
          await destroyCloudinaryAsset(lesson.videoPublicId, 'video');
        }
        if (lesson.thumbnailPublicId) {
          await destroyCloudinaryAsset(lesson.thumbnailPublicId, 'image');
        }
      }
    }

    await Course.findByIdAndDelete(id);

    return response.success(res, null, 'Course and associated media deleted successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/sections (Admin Only)
const addSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    course.sections.push({ title, lessons: [] });
    await course.save();

    return response.success(res, course, 'Section added successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:id/sections/:sectionId/lessons (Admin Only)
const addLesson = async (req, res, next) => {
  try {
    const { id, sectionId } = req.params;
    const {
      title,
      description,
      videoProvider,
      googleDriveFileId,
      googleDriveUrl,
      videoUrl,
      videoLink,
      videoPublicId,
      videoDuration,
      videoSize,
      videoFormat,
      thumbnail,
      thumbnailPublicId,
      pdfUrl,
      assignment,
      isPreview,
      order
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return response.error(res, 'Section not found', 404);
    }

    const rawDriveInput = googleDriveFileId || googleDriveUrl || videoUrl || videoLink || '';
    const cleanDriveId = videoService.extractGoogleDriveFileId(rawDriveInput);
    const resolvedProvider = videoProvider || (cleanDriveId ? 'google-drive' : 'external');

    if (resolvedProvider === 'google-drive' && !cleanDriveId) {
      return response.error(res, 'Invalid Google Drive video URL or File ID provided.', 400);
    }

    section.lessons.push({
      title,
      description: description || '',
      videoProvider: resolvedProvider,
      googleDriveFileId: cleanDriveId,
      videoUrl: videoUrl || videoLink || '',
      videoPublicId: videoPublicId || '',
      videoDuration: Number(videoDuration) || 0,
      videoSize: Number(videoSize) || 0,
      videoFormat: videoFormat || '',
      thumbnail: thumbnail || '',
      thumbnailPublicId: thumbnailPublicId || '',
      pdfUrl: pdfUrl || '',
      assignment: assignment || '',
      isPreview: !!isPreview,
      order: Number(order) || 0
    });

    await course.save();
    return response.success(res, course, 'Lesson added successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id/sections/:sectionId/lessons/:lessonId (Admin Only)
const updateLesson = async (req, res, next) => {
  try {
    const { id, sectionId, lessonId } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return response.error(res, 'Section not found', 404);
    }

    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return response.error(res, 'Lesson not found', 404);
    }

    // Handle replaced or deleted video asset cleanup
    if (updates.videoPublicId !== undefined && updates.videoPublicId !== lesson.videoPublicId && lesson.videoPublicId) {
      await destroyCloudinaryAsset(lesson.videoPublicId, 'video');
    }

    // Handle replaced or deleted thumbnail asset cleanup
    if (updates.thumbnailPublicId !== undefined && updates.thumbnailPublicId !== lesson.thumbnailPublicId && lesson.thumbnailPublicId) {
      await destroyCloudinaryAsset(lesson.thumbnailPublicId, 'image');
    }

    // Handle Google Drive extraction
    if (updates.googleDriveFileId !== undefined || updates.googleDriveUrl !== undefined || updates.videoUrl !== undefined) {
      const rawInput = updates.googleDriveFileId || updates.googleDriveUrl || updates.videoUrl || lesson.googleDriveFileId || '';
      const cleanDriveId = videoService.extractGoogleDriveFileId(rawInput);
      if (cleanDriveId) {
        lesson.googleDriveFileId = cleanDriveId;
      }
    }

    if (updates.videoProvider !== undefined) {
      lesson.videoProvider = updates.videoProvider;
    } else if (lesson.googleDriveFileId && !lesson.videoProvider) {
      lesson.videoProvider = 'google-drive';
    }

    if (updates.title !== undefined) lesson.title = updates.title;
    if (updates.description !== undefined) lesson.description = updates.description;
    if (updates.videoUrl !== undefined) lesson.videoUrl = updates.videoUrl;
    if (updates.videoPublicId !== undefined) lesson.videoPublicId = updates.videoPublicId;
    if (updates.videoDuration !== undefined) lesson.videoDuration = Number(updates.videoDuration);
    if (updates.videoSize !== undefined) lesson.videoSize = Number(updates.videoSize);
    if (updates.videoFormat !== undefined) lesson.videoFormat = updates.videoFormat;
    if (updates.thumbnail !== undefined) lesson.thumbnail = updates.thumbnail;
    if (updates.thumbnailPublicId !== undefined) lesson.thumbnailPublicId = updates.thumbnailPublicId;
    if (updates.pdfUrl !== undefined) lesson.pdfUrl = updates.pdfUrl;
    if (updates.assignment !== undefined) lesson.assignment = updates.assignment;
    if (updates.isPreview !== undefined) lesson.isPreview = !!updates.isPreview;
    if (updates.order !== undefined) lesson.order = Number(updates.order);

    await course.save();
    return response.success(res, course, 'Lesson updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id/sections/:sectionId/lessons/:lessonId (Admin Only)
const deleteLesson = async (req, res, next) => {
  try {
    const { id, sectionId, lessonId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return response.error(res, 'Section not found', 404);
    }

    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return response.error(res, 'Lesson not found', 404);
    }

    // Clean up video and thumbnail assets from Cloudinary
    if (lesson.videoPublicId) {
      await destroyCloudinaryAsset(lesson.videoPublicId, 'video');
    }
    if (lesson.thumbnailPublicId) {
      await destroyCloudinaryAsset(lesson.thumbnailPublicId, 'image');
    }

    section.lessons.pull(lessonId);
    await course.save();

    return response.success(res, course, 'Lesson deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:courseId/lessons/:lessonId/video (Secure Authorization Endpoint)
const getLessonVideo = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    // Find target lesson across course sections
    let foundLesson = null;
    for (const section of course.sections) {
      const match = section.lessons.id(lessonId);
      if (match) {
        foundLesson = match;
        break;
      }
    }

    if (!foundLesson) {
      return response.error(res, 'Lesson not found in this course', 404);
    }

    // 1. If lesson is marked as Free Preview -> Allow access immediately
    if (foundLesson.isPreview) {
      const videoInfo = videoService.getVideoEmbedInfo(foundLesson);
      return response.success(res, {
        title: foundLesson.title,
        description: foundLesson.description,
        pdfUrl: foundLesson.pdfUrl,
        assignment: foundLesson.assignment,
        ...videoInfo
      }, 'Free preview lesson details fetched successfully');
    }

    // 2. If not preview -> Require authentication
    if (!req.user) {
      return response.error(res, 'Not authorized, please sign in to watch full lesson content.', 401);
    }

    // 3. Admin bypass
    if (req.user.role === 'admin') {
      const videoInfo = videoService.getVideoEmbedInfo(foundLesson);
      return response.success(res, {
        title: foundLesson.title,
        description: foundLesson.description,
        pdfUrl: foundLesson.pdfUrl,
        assignment: foundLesson.assignment,
        ...videoInfo
      }, 'Admin authorized lesson video details fetched');
    }

    // 4. Verify user purchase/enrollment
    const Purchase = require('../models/Purchase');
    const purchase = await Purchase.findOne({
      userId: req.user.id,
      courseId,
      paymentStatus: 'completed'
    });

    const isFreeCourse = course.price === 0 || course.discount === 100;

    if (!purchase && !isFreeCourse) {
      return response.error(res, 'Course not purchased. Please enroll to unlock full video access.', 403);
    }

    const videoInfo = videoService.getVideoEmbedInfo(foundLesson);
    return response.success(res, {
      title: foundLesson.title,
      description: foundLesson.description,
      pdfUrl: foundLesson.pdfUrl,
      assignment: foundLesson.assignment,
      ...videoInfo
    }, 'Authorized lesson video details fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addSection,
  addLesson,
  updateLesson,
  deleteLesson,
  getLessonVideo
};
