const Blog = require('../models/Blog');
const response = require('../helpers/response');

// GET /api/blogs (Public)
const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .select('title slug thumbnail author tags publishedDate seoMeta')
      .sort('-publishedDate');

    return response.success(res, blogs, 'Blogs fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/blogs/:slug (Public)
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return response.error(res, 'Blog post not found', 404);
    }

    return response.success(res, blog, 'Blog retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/blogs (Admin Only)
const createBlog = async (req, res, next) => {
  try {
    const { title, content, author, tags, thumbnail, seoMeta } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const exists = await Blog.findOne({ slug });
    if (exists) {
      return response.error(res, 'Blog with this title already exists', 400);
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      author: author || 'Dhan Vijeta',
      thumbnail: thumbnail || '',
      tags: tags || [],
      seoMeta: seoMeta || { title, description: title }
    });

    return response.success(res, blog, 'Blog post created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/blogs/:id (Admin Only)
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!blog) {
      return response.error(res, 'Blog post not found', 404);
    }

    return response.success(res, blog, 'Blog post updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/blogs/:id (Admin Only)
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return response.error(res, 'Blog post not found', 404);
    }
    return response.success(res, null, 'Blog post deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
