
export default async function(req, res) {
  console.log(req.headers)
  const { page = 1, limit = 30 } = req.query;
  const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  const data = await response.json();

  res.status(200).json(data);
};

