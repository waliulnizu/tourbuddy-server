import { Router } from 'express';
const router: Router = Router();
import { auth, adminOnly } from '../middleware/auth';
import upload from '../middleware/upload';

import {
  dashboardIndex, allPosts, pendingPosts, activePosts,
  viewPost, acceptPost, allTravelers, addUser
} from '../controllers/adminController';

import {
  index as bannerIndex, store as bannerStore,
  update as bannerUpdate, destroy as bannerDestroy
} from '../controllers/bannerController';

import {
  index as sliderIndex, store as sliderStore,
  update as sliderUpdate, destroy as sliderDestroy
} from '../controllers/sliderController';

import {
  index as guideIndex, store as guideStore,
  update as guideUpdate, destroy as guideDestroy
} from '../controllers/guideController';

import { show as aboutShow, update as aboutUpdate } from '../controllers/aboutController';
import { show as contactShow, update as contactUpdate } from '../controllers/contactController';

import {
  index as blogIndex, updateStatus as blogUpdateStatus, destroy as blogDestroy
} from '../controllers/blogManageController';

import {
  index as appIndex, updateStatus as appUpdateStatus, destroy as appDestroy
} from '../controllers/applicationController';

router.use(auth, adminOnly);

router.get('/', dashboardIndex);

router.get('/posts/all', allPosts);
router.get('/posts/pending', pendingPosts);
router.get('/posts/active', activePosts);
router.get('/posts/:id', viewPost);
router.put('/posts/accept/:id', acceptPost);

router.get('/travelers', allTravelers);
router.post('/users', addUser);

router.get('/banners', bannerIndex);
router.post('/banners', upload.single('image'), bannerStore);
router.put('/banners/:id', upload.single('image'), bannerUpdate);
router.delete('/banners/:id', bannerDestroy);

router.get('/sliders', sliderIndex);
router.post('/sliders', upload.single('slider_image'), sliderStore);
router.put('/sliders/:id', upload.single('slider_image'), sliderUpdate);
router.delete('/sliders/:id', sliderDestroy);

router.get('/guides', guideIndex);
router.post('/guides', upload.single('guide_image'), guideStore);
router.put('/guides/:id', upload.single('guide_image'), guideUpdate);
router.delete('/guides/:id', guideDestroy);

router.get('/about', aboutShow);
router.put('/about', upload.single('about_image'), aboutUpdate);

router.get('/contact', contactShow);
router.put('/contact', contactUpdate);

router.get('/blogs', blogIndex);
router.put('/blogs/:id/status', blogUpdateStatus);
router.delete('/blogs/:id', blogDestroy);

router.get('/applications', appIndex);
router.put('/applications/:id/status', appUpdateStatus);
router.delete('/applications/:id', appDestroy);

export default router;
