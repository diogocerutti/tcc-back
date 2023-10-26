import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../new-tcc-front/src/img");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + "_" + file.originalname);
  },
});

export const upload = multer({ storage: storage });
