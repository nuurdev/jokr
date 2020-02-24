import express from 'express';
import verify from '../../../utils/verify-token';
import User from '../../../model/user';

const router = express.Router();

router.get(
  '/profile',
  verify,
  async (req, res): Promise<void> => {
    const { _id } = req.body.user;
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(400).send({ message: 'User not found' });
      return;
    }
    res.send({ user });
  }
);

export default router;
