export default async function(req, res) {
  const { id, width, height, square } = req.query;

  let url = `https://picsum.photos/id/${id}`;

  if (square) {
    url += `/${square}`;
  } else if (width && height) {
    url += `/${width}/${height}`;
  } else {
    res.status(400).json({ error: 'Either square or both width and height must be provided' });
    return;
  }

  res.redirect(url);
};

