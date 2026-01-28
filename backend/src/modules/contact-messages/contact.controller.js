import * as contactService from './contact.service.js';

export const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await contactService.createMessage(req.body);

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await contactService.getAllMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        await contactService.deleteMessageById(Number(id));

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};