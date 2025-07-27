import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  if (eventType === 'user.created') {
    try {
      await connectDB();
      
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
      
      if (!primaryEmail) {
        throw new Error('Primary email not found');
      }

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId });
      if (existingUser) {
        console.log('User already exists:', clerkId);
        return new Response('User already exists', { status: 200 });
      }

      // Create new user
      const newUser = new User({
        clerkId,
        email: primaryEmail.email_address,
        firstName: first_name || '',
        lastName: last_name || '',
        imageUrl: image_url,
      });

      await newUser.save();
      console.log('User created successfully:', clerkId);
      
      return new Response('User created successfully', { status: 200 });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    try {
      await connectDB();
      
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
      
      if (!primaryEmail) {
        throw new Error('Primary email not found');
      }

      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        {
          email: primaryEmail.email_address,
          firstName: first_name || '',
          lastName: last_name || '',
          imageUrl: image_url,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!updatedUser) {
        console.log('User not found for update:', clerkId);
        return new Response('User not found', { status: 404 });
      }

      console.log('User updated successfully:', clerkId);
      return new Response('User updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await connectDB();
      
      const { id: clerkId } = evt.data;
      
      // Delete user from database
      const deletedUser = await User.findOneAndDelete({ clerkId });
      
      if (!deletedUser) {
        console.log('User not found for deletion:', clerkId);
        return new Response('User not found', { status: 404 });
      }

      console.log('User deleted successfully:', clerkId);
      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
} 