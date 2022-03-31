const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt = req.file.originalname.split(".").pop();
        let filename = `${req.file.filename}.${originalExt}`;

        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const player = new Player({
              ...payload,
              avatar: filename,
            });

            await player.save();

            delete player._doc.password;
            res.status(201).json({ data: player });
          } catch (error) {
            if (error && error.name === "ValidationError") {
              return res.status(422).json({
                error: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });
      } else {
        let player = new Player(payload);
        await player.save();

        delete player._doc.password;

        res.status(201).json({ data: player });
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },

  signin: (req, res, next) => {
    const { email, password } = req.body;

    Player.findOne({ email })
      .then((player) => {
        if (!player)
          return res
            .status(403)
            .json({ message: "email yang anda masukan belum terdaftar" });

        const checkPassword = bcrypt.compareSync(password, player.password);

        if (!checkPassword)
          return res
            .status(403)
            .json({ message: "password yang anda masukan salah" });

        const token = jwt.sign(
          {
            player: {
              _id: player._id,
              username: player.username,
              email: player.email,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          },
          config.jwtKey
        );

        res.status(200).json({
          data: {
            token,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || "Internal server error",
        });
      });
  },
};
