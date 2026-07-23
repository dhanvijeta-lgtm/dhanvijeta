const Course = require('../models/Course');
const Purchase = require('../models/Purchase');
const response = require('../helpers/response');

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
      .select('title slug description instructor duration price discount rating thumbnail category benefits isPublished createdAt')
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
        videoUrl: lesson.videoUrl || '',
        videoDuration: lesson.videoDuration
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
    const { title, description, instructor, duration, price, discount, category, benefits, faqs, isPublished } = req.body;
    
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

    const course = await Course.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    return response.success(res, course, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id (Admin Only)
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }
    return response.success(res, null, 'Course deleted successfully');
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
    const { title, description, videoUrl, videoLink, videoPublicId, videoDuration, pdfUrl, assignment } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return response.error(res, 'Course not found', 404);
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      return response.error(res, 'Section not found', 404);
    }

    section.lessons.push({
      title,
      description: description || '',
      videoUrl: videoUrl || videoLink || '',
      videoPublicId: videoPublicId || '',
      videoDuration: videoDuration || 0,
      pdfUrl: pdfUrl || '',
      assignment: assignment || ''
    });

    await course.save();
    return response.success(res, course, 'Lesson added successfully');
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
  addLesson
};
