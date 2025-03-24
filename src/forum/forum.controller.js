const prisma = require('../utils/prisma');
const authMiddleware = require('../middleware/auth');

// Get all forum posts
async function getPosts(request) {
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: posts
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to get posts',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

// Get a single forum post with comments
async function getPost(request, postId) {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!post) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Post not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: post
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to get post',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

// Create a new forum post
async function createPost(request) {
  try {
    // Check authentication
    const authError = await authMiddleware(request);
    if (authError) return authError;

    const data = await request.json();
    const { title, content } = data;

    // Validate input
    if (!title || !content) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Title and content are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Create post
    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        userId: request.user.id
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Post created successfully',
      data: post
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create post',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

// Add a comment to a forum post
async function addComment(request, postId) {
  try {
    // Check authentication
    const authError = await authMiddleware(request);
    if (authError) return authError;

    const data = await request.json();
    const { content } = data;

    // Validate input
    if (!content) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Comment content is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Post not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Create comment
    const comment = await prisma.forumComment.create({
      data: {
        content,
        userId: request.user.id,
        postId
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Comment added successfully',
      data: comment
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  addComment
};
