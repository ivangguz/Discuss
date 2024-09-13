'use server';

import type {Post} from '@prisma/client'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {auth} from '@/auth';
import { db } from '@/db';
import paths from '@/paths';
import { title } from 'process';
import { Content } from 'next/font/google';
import TopicCreateForm from '@/components/topics/Topic-create-form';

const createPostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10)
});

interface CreatePostFormState{
    errors:{
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}

export async function createPost(
    slug: string,
    formState: CreatePostFormState,
    formData: FormData
    ): Promise<CreatePostFormState> {
    const result = createPostSchema.safeParse({
        title: formData.get('title'),
        Content: formData.get('content')
    });

    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    };

    const session = await auth();
    if (!session || !session.user){
        return {
            errors:{
                _form: ['You must be signed in to do this'],
            },
        };
    };

    const topic = await db.topic.findFirst({
        where: {slug}
    });

    if(!topic){
        return {
            errors:{
                _form: ["Cannot find errors"],
            }
        }
    }

    return{
        errors: {}
    };
    //TODO: Revalidate the topic show page
    
}