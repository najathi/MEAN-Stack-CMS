const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const url = req.protocol + '://' + req.get('host');
  // req.protocol = http or https
  const post = new Post({
    title: title,
    content: content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  //console.log('14 posts controller', req.userData.userId, req.userData.email);
  try {
    const createdPost = await post.save();
    console.log(post);
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        id: createdPost._id,
        ...createdPost,
        //title: createdPost.title,
        //content: createdPost.content,
        //imagePath: createdPost.imagePath
      }
    });
  } catch (error) {
    res.status(500).json({message: 'Creating a post failed!'});
  }
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({message: 'Fetching posts failed!'});
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({message: 'Fetching postv failed!'});
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  //await Post.findByIdAndRemove(postId);
  Post.deleteOne({
    _id: postId,
    creator: req.userData.userId
  }).then(deletedPost => {
    if (deletedPost.n > 0) {
      res.status(200).json({message: 'Post Deleted'});
    } else {
      res.status(401).json({message: 'Not Authorized!'});
    }
  }).catch(error => {
    res.status(500).json({message: 'Couldn\'t delete post!'});
  });


};

exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  const updateTitle = req.body.title;
  const updateContent = req.body.content;
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: postId,
    title: updateTitle,
    content: updateContent,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
    _id: postId,
    creator: req.userData.userId
  }, post).then(updatedPost => {
    if (updatedPost.n > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not Authorized!'});
    }
  }).catch(error => {
    res.status(500).json({message: 'Couldn\'t update post!'});
  });

};



