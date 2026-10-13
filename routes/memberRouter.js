const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, createMember, updateMemberById, deleteMember } = require('../controllers/memberController');

router.get('/', getAllMembers);
router.post('/', createMember);
router.get('/:id', getMemberById);
router.put('/:id', updateMemberById);
router.delete('/:id', deleteMember);

module.exports = router;
