import express from 'express';

type handleExpressNotFound = (req: express.Request, res: express.Response) => Promise<void>;

const handleExpressNotFound: handleExpressNotFound = async (req, res) => {
  res.sendStatus(404);
};

export default handleExpressNotFound;
