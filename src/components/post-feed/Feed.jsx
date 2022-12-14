import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import Post from './Post';
import PropTypes from 'prop-types';
import FootBar from './FootBar';

function Feed(props) {
    const {fetchForUsername, userInfo, fetchFunction} = props;

    const fetchPosts = async (pageParam) => {
        const results = await fetchFunction(fetchForUsername, pageParam);
        return { results, nextPage: pageParam + 1, totalPages: 100 };
    };

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage
    } = useInfiniteQuery('posts', ({ pageParam = 1 }) => fetchPosts(pageParam), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => (lastPage.nextPage < lastPage.totalPages) ? lastPage.nextPage : undefined
    });
    
    return (
        <>
            {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                        <p>There was an error</p>
                    ) : (
                        <>
                            <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
                                {data.pages.map((page) =>
                                    page.results.map((post) => <Post post={post} userInfo={userInfo} key={post.id}/>)
                                )}
                            </InfiniteScroll>
                            <FootBar/>
                        </>
                    )
            }
        </>
    );
}

Feed.propTypes = {
    fetchFunction: PropTypes.func.isRequired,
    fetchForUsername: PropTypes.string.isRequired,
    userInfo: PropTypes.any.isRequired
};

export default Feed;