const express = require('express');
const router = express.Router();
const BlogPost = require('../models/CommunityPosts');

// Create a new blog post
router.post('/creating_post', async (req, res) => {
    try {
        const blogPost = new BlogPost(req.body);
        const savedBlogPost = await blogPost.save();
        res.status(201).json(savedBlogPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all blog posts
router.get('/get_all_posts', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find().populate('author').exec();
        res.json(blogPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific blog post
router.get('/get_posts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id).populate('author comments.user').exec();
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(blogPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a comment to a blog post
router.post('/add_comments/:id/comments', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        blogPost.comments.push(req.body);
        await blogPost.save();
        res.status(201).json(blogPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a blog post
router.put('/update/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(blogPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a blog post
router.delete('/delete/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
