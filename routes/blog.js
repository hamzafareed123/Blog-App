const { Router } = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");
const Comment = require("../models/comments")

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addblog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ err: "Title and Description are required" });
    }

    const blog = await Blog.create({
      title,
      body,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user._id,
    });

    res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Something went wrong" });
  }

  console.log(req.body);
  console.log(req.file);
});


router.get("/:id",async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy")
   console.log(blog)
   console.log(comments)
  return res.render("blogs",{
    user:req.user,
    blogs:blog,
    comments
  });
 
})

router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ err: "Unauthorized: Please login first" });
  }

  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports = router;
