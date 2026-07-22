import { Router } from 'express';
const router: Router = Router();
import {
  index,
  singlepost,
  singleblog,
  allpost,
  allBlogPost,
  about,
  guidesList,
  contact,
  search,
  travelers,
  members
} from '../controllers/frontendController';

router.get('/home', index);
router.get('/post/:id', singlepost);
router.get('/blog/:id', singleblog);
router.get('/posts', allpost);
router.get('/blogs', allBlogPost);
router.get('/about', about);
router.get('/guides', guidesList);
router.get('/contact', contact);
router.get('/search', search);
router.get('/travelers', members);
router.get('/travelers/:id', travelers);

export default router;
