import Answer from '@/components/forms/Answer';
import Metric from '@/components/shared/Metric';
import ParseHtml from '@/components/shared/ParseHtml';
import RenderTags from '@/components/shared/RenderTags';
import { getQuestionById } from '@/lib/actions/question.action';
import { formatNumber, getTimeStamps } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const Page = async ({ params, searchParams }: any) => {
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className="flex items-center justify-start gap-1"
            href={`/profile/${result.author.clerkId}`}
          >
            <Image
              className="rounded-full"
              src={result.author.picture}
              alt={result.author.name}
              width={20}
              height={20}
            />
            <p className="paragraph-semibold text-invert primary-text-gradient">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">Voting</div>
        </div>
        <h2 className="h2-semibold text-invert mt-3.5 w-full text-left ">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="Clock"
          title=""
          textStyles="small-medium card-text-invert-secondary"
          value={` Asked ${getTimeStamps(result.createdAt)}`}
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          title="Answers"
          textStyles="small-medium card-text-invert-secondary"
          value={formatNumber(result.answers.length)}
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          title="Views"
          textStyles="small-medium card-text-invert-secondary"
          value={formatNumber(result.views)}
        />
      </div>

      <ParseHtml content={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTags
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <Answer />
    </>
  );
};

export default Page;