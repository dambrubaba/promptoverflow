import QuestionCard from '@/components/cards/QuestionCard';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';

import { getQuestionByTagId } from '@/lib/actions/tag.actions';
import Image from 'next/image';

const Page = async ({ params, searchParams }: any) => {
  const result = await getQuestionByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });



  return (
    <main>
      <h1 className="sm:h1-bold h2-bold text-invert w-full">
        {result.tagTitle}
      </h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route="/"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <div className=" flex-center my-10 w-full flex-col">
            <Image
              src="/assets/images/no-questions.svg"
              alt="no Question"
              width={270}
              height={200}
              className="hidden dark:flex"
            />
            <Image
              src="/assets/images/light-no-questions.svg"
              alt="no Question"
              width={270}
              height={200}
              className="dark:hidden"
            />
            <h2
              className="h2-bold
          text-invert mt-8"
            >
              There&apos;s no Tags to show
            </h2>
            <p className="body-regular text-invert-secondary mt-3.5 max-w-md text-center">
              Be the first to break the silence! 🚀 Ask a Question and kickstart
              the discussion. our query could be the next big thing others learn
              from. Get involved! 💡
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
