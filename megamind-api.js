const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/megamindify', upload.single('photo'), async (req, res) => {
  try {
    const image = await Jimp.read(req.file.path);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      const isSkin = r > 90 && g > 40 && b < 120 && r > g && r > b;

      if (isSkin) {
        this.bitmap.data[idx + 0] = 60;
        this.bitmap.data[idx + 1] = 120;
        this.bitmap.data[idx + 2] = 255;
      }
    });

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image.');
  }
});

app.get('/', (req, res) => {
  res.send('Megamindify API is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
