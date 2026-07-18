import { Request, Response } from 'express';
import Contact from '../models/Contact';

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOne();
    res.json({ contact });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address, city, email, telephone, phone, phone_2 } = req.body;
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({ address, city, email, telephone, phone, phone_2 });
    } else {
      if (address) contact.address = address;
      if (city) contact.city = city;
      if (email) contact.email = email;
      if (telephone) contact.telephone = telephone;
      if (phone) contact.phone = phone;
      if (phone_2) contact.phone_2 = phone_2;
    }
    await contact.save();
    res.json({ message: 'Contact updated successfully', contact });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
