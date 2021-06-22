const Category = require('../models/categories');
const Post = require('../models/posts')
const Comment = require('../models/comments')
const fs = require("fs");
// const path = require("path");
// const appDir = path.dirname(require.main.filename);



exports.registerCategory = function (req, res) {
  const registerData = req.body

  const category = new Category(registerData);

  return category.save((errors, savedCategory) => {
    if (errors) {
      return res.status(422).json({ errors })
    }
    res.status(200).send({ success: true });
  })
}


exports.getCategories = function (req, res) {
  Category.find({}, (error, categories) => {
    if (error) console.log(error);
    res.json(categories);
  });
}

exports.deleteCategory = function (req, res) {
  const id = req.params.id
  Category.findOneAndDelete({ _id: id }, (error, categoryDeleted) => {
    if (categoryDeleted) {
      res.status(200).json({ success: true });
    } else {
      res.status(422).json({
        errors: {
          message: 'Operation Failed'
        }
      });
    }
  });
}

exports.registerPost = function (req, res) {
  console.log(req.fields.user);
  const title = req.fields.title
  const status = req.fields.status
  const allowComments = req.fields.allowComments
  const category = req.fields.category
  const description = req.fields.description
  const user = req.fields.user
  const imageUpload = req.files.image;
  let image = imageUpload.name
  image = +new Date() + "_" + image;
  const oldPath = imageUpload.path;
  const newPath = `./uploads/${image}`;
  const rawData = fs.readFileSync(oldPath);

  fs.writeFile(newPath, rawData, (error) => {
    if (error) res.status(500).send(error);
  });
  const post = new Post({
    title: title,
    status: status,
    allowComments: allowComments,
    category: category,
    description: description,
    image: image,
    user: user
  });

  return post.save((errors, savedPost) => {
    if (errors) {
      return res.status(200).json({ success: false })

    }
    if (savedPost) {
      return res.status(200).json({ success: true });
    }
  })
}
exports.getPosts = function (req, res) {
  Post.find({})
    .populate('category')
    .then(posts => {
      res.json(posts);
    })
}
exports.deletePost = function (req, res) {
  const id = req.params.id
  Post.findById(id, (error, post) => {
    let imagePath = `./uploads/${post.image}`
    fs.unlink(imagePath, (error) => {
      if (error) res.status(500).send(error);
    });
    if (post.remove()) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  });
}

exports.updatePost = function (req, res) {

  const id = req.fields._id;
  const title = req.fields.title
  const status = req.fields.status
  const allowComments = req.fields.allowComments
  const category = req.fields.category
  const description = req.fields.description
  Post.findById(id, (error, product) => {
    if (error) res.status(500).send(error);
    if (product.image === req.fields.image) {
      product.image = req.fields.image
    } else {
      let imagePath = `./uploads/${product.image}`
      fs.unlink(imagePath, (error) => {
        if (error) res.status(500).send(error);
      });
      const imageUpload = req.files.image;
      let image = imageUpload.name
      image = +new Date() + "_" + image;
      const oldPath = imageUpload.path;
      const newPath = `./uploads/${image}`;
      const rawData = fs.readFileSync(oldPath);
      fs.writeFile(newPath, rawData, (error) => {
        if (error) res.status(500).send(error);
      });
      product.image = image
    }
    product.title = title
    product.status = status
    product.allowComments = allowComments
    product.category = category
    product.description = description
    product.save((error) => {
      if (error) res.status(500).send(error);
      return res.status(200).json({ success: true });
    });
  })

}


exports.getPostById = function (req, res) {
  console.log(req.query.p);
  const p = req.query.p ? req.query.p : 2;
  const id = req.params.id;
  Post.findById({ _id: id })
    .populate('category')
    .populate({ path: 'comments', populate: { path: 'user', model: 'User' } })
    .populate('user')
    .then(post => {
      post.comments = post.comments.reverse().slice(0, p)
      res.json(post);
    })
}


exports.getPostsByCategories = function (req, res) {
  const p = req.query.p ? req.query.p : 1;
  if (req.params.category == 'all') {
    Post.find({})
      .populate('category')
      .skip((p - 1) * 2)
      .limit(2)
      .then(posts => {
        res.json(posts);
      })
  } else {
    const category = req.params.category;
    Category.find({ category: category }, (error, category) => {
      Post.find({ category: category })
        .skip((p - 1) * 2)
        .limit(2)
        .then(posts => {
          res.json(posts);
        })
    })
  }

}

exports.getPostComments = function (req, res) {
  const id = req.params.id;
  const p = req.query.p ? req.query.p : 2;
      Post.findOne({ _id: id })
      .populate({ path: 'comments', populate: { path: 'user', model: 'User' } })
        .then(post => {
            res.json(post.comments.reverse().slice(0, 2));
        })
}

exports.countAllPosts = function (req, res) {
  const category = req.params.category;
  if (category == 'all') {
    Post.countDocuments({}, (error, count) => res.json(count));
  } else {
    Category.find({ category: category }, (error, category) => {
      Post.countDocuments({ category: category }, (error, count) => res.json(count))
    })
  }
}

exports.addComment = function (req, res) {
  const id = req.params.id;
  Post.findOne({ _id: id })
    .populate('category')
    .then(post => {
      const newComment = new Comment({
        user: req.body.user,
        message: req.body.message
      })
      post.comments.push(newComment);
      newComment.save().then(() => {
        post.save().then((savedPost) => {
          return res.json(savedPost);
        })
          .catch(err => {
            res.status(500).send(err)
          })
      })
        .catch(err => {
          res.status(500).send(err)
        })
    })
}

exports.getUserComments = function (req, res) {
  const user = req.params.id;
  Comment.find({ user: user })
    .populate('user')
    .then(comments => {
      res.json(comments);
    })
}

exports.deleteComment = function (req, res) {
  const id = req.params.id
  Comment.findOneAndDelete({ _id: id })
    .then(() => {
      Post.findOneAndUpdate({ comments: id }, { $pull: { comments: id } })
        .then(() => {
          return res.status(200).json({ success: true });
        })
        .catch(err => {
          res.status(500).send(err)
        })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getPostCommentCount = function (req, res) {
  const id = req.params.id;
    Post.findOne({ _id: id })
    .then(post => {
      res.json(post.comments.length)
    })
}


