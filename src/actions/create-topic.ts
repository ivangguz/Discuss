'use server';
import type { Topic } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {z} from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import paths from '@/paths';

const createTopicSchema = z.object({
    name: z.string().min(3).regex(/^[a-z-]+$/, {message: "Must be lowercase letters or dashes without spaces"}),
    description: z.string().min(10),
});

interface CreateTopicFormState{
    errors:{
        name? : string[];
        description? : string[];
        _form?: string[];
    }
}

export async function createTopic(formState: CreateTopicFormState, formData: FormData) : Promise <CreateTopicFormState>{
    const results = createTopicSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
    });

    if(!results.success){
        return {
            errors: results.error.flatten().fieldErrors,
        };
    }

    const session = await auth();
    if (!session || !session.user){
        return {
            errors: {
                _form: ['You must be signed in to use this'],
            }
        };
    }

    let topic: Topic;
    try {
        topic = await db.topic.create({
            data: {
                slug: results.data.name,
                description: results.data.description
            }
        });
    } catch (err: unknown) {
        if(err instanceof Error){
            return{
                errors: {
                    _form: [err.message]
                }
            };
        } else{
            return{
                errors: {
                    _form: ['Something went wrong']
                }
            };
        }
    }
    
    revalidatePath('/');
    redirect(paths.topicShowPath(topic.slug));
}