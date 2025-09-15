import { gql } from '@apollo/client';

const GET_BOOKS = gql`
    query GetBooks {
        books {
            uuid
            title
            author
            isbn
        }
    }
`;

export default GET_BOOKS;
