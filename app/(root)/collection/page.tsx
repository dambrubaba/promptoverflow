import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import Filter from '@/components/shared/filter';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { QuestionFilters } from '@/constants/filters';
import { getSavedQuestions } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

export default async function Home({ searchParams }: any) {
  const { userId } = auth();
  if (!userId) return null;


  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams?.q,
  });
  return (
    <main>
      <h1 className="sm:h1-bold h2-bold text-invert w-full">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.question.length > 0 ? (
          result.question.map((question: any) => (
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
          <NoResult 
            title="You haven’t saved any questions yet."
            description="You haven’t saved any questions yet. Save Questions you would want to visit letter 💡"
            hasButton={false}
          
          />
        )}
      </div>
    </main>
  );
}
