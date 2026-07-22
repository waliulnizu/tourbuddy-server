import { Router } from 'express';
const router: Router = Router();
import { auth } from '../middleware/auth';
import upload from '../middleware/upload'; 
import {
  travelerDashboard,
  updateProfile,
  changePassword,
  myPosts,
  savePost,
  updatePost,
  deletePost,
  myBlogs,
  saveBlog,
  updateBlog,
  deleteBlog,
  applyAsGuide,
  myApplication,
  updateApplication,
  deleteApplication,
  deleteTraveler
} from '../controllers/travelerController';
import {
  requestJoin,
  cancelJoin,
  approveConnect,
  rejectConnect
} from '../controllers/connectController';
import {
  sendMessage,
  getInbox,
  getConversation,
  markAsRead,
  getUnreadCount
} from '../controllers/messageController';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  deleteNotification
} from '../controllers/notificationController';

router.use(auth);

router.get('/dashboard', travelerDashboard);
router.put('/profile', upload.single('profilePicture'), updateProfile);
router.put('/change-password', changePassword);

router.get('/posts', myPosts);
router.post('/posts', savePost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

router.get('/blogs', myBlogs);
router.post('/blogs', saveBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.post('/apply-guide', upload.single('cv'), applyAsGuide);
router.get('/my-application', myApplication);
router.put('/my-application', upload.single('cv'), updateApplication);
router.delete('/my-application', deleteApplication);

router.post('/connect/:postId', requestJoin);
router.delete('/connect/:postId', cancelJoin);
router.put('/connect/approve/:connectId', approveConnect);
router.put('/connect/reject/:connectId', rejectConnect);

router.post('/message', sendMessage);
router.get('/inbox', getInbox);
router.get('/messages/:otherUserId/:postId', getConversation);
router.put('/messages/read/:senderId/:postId', markAsRead);
router.get('/unread-count', getUnreadCount);

router.get('/notifications', getNotifications);
router.get('/notifications/unread-count', getUnreadNotificationCount);
router.put('/notifications/read/:id', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

router.delete('/:id', deleteTraveler);

export default router;