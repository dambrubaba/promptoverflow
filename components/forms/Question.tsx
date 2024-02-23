'use client';
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/validation';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion } from '@/lib/actions/question.action';

const type: any = 'edit';

const Question = () => {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);
    try {
      await createQuestion({});
      // make async code to create a question
      // contain all form data
      // navigate to the question page
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  // * Define a function to handle adding tags.

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tags should be less than 15 characters',
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = '';
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue('tags', newTags);
  };

  return (
    <div>
      {' '}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col ">
                <FormLabel className="paragraph-semibold text-invert">
                  Question Title <span className="text-primary-main">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular input_background text-invert-secondary min-h-[56px] border"
                    placeholder="Ask a Question"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular text-invert-3 mt-2.5 ">
                  Ask your question here.
                </FormDescription>
                <FormMessage className="text-error-700" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-invert">
                  Detailed explanation of your problem{' '}
                  <span className="text-primary-main">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'link',
                      ],
                      toolbar:
                        'undo redo | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter | ' +
                        'alignright alignjustify | bullist numlist link',
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular text-invert-3 mt-2.5 ">
                  Describe your question here, but remember, the more specific
                  you are, the better the answer you&apos;ll get. Imagine
                  you&apos;re asking a friend for help!
                </FormDescription>
                <FormMessage className="text-error-700" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-invert">
                  Tags <span className="text-primary-main">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="no-focus paragraph-regular input_background text-invert-secondary min-h-[56px] border"
                      placeholder="Add Tags..."
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-3">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className="subtle-medium question-tag-bg flex cursor-pointer
                            items-center  justify-center gap-2 rounded-md  px-3 py-2 uppercase duration-300 ease-in-out hover:border-error-500"
                            onClick={() => handleTagRemove(tag, field)}
                          >
                            {tag}
                            <Image
                              src="/assets/icons/close.svg"
                              alt="Remove"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert dark:invert-0"
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular text-invert-3 mt-2.5 ">
                  Add up to 3 tags that describe the problem you&apos;re facing.
                  Press Enter to add each tag.
                </FormDescription>
                <FormMessage className="text-error-700" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`primary-gradient px-3 py-4 text-white ${isSubmitting && 'cursor-progress'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === 'edit' ? 'Updating...' : 'Posting...'}</>
            ) : (
              <>{type === 'edit ' ? 'Edit Question' : 'Ask Question'}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Question;