import { render, screen } from '@testing-library/react-native';
import { RepositoryListContainer } from '../components/RepositoryList';
import { within } from '@testing-library/react-native';

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      // Add your test code here
      render(<RepositoryListContainer repositories={repositories} />);
      //screen.debug();

      const repositoryItems = screen.getAllByTestId('repositoryItem');
      const [firstRepository, secondRepository] = repositoryItems;

      expect(within(firstRepository).getByText('jaredpalmer/formik')).toBeTruthy();
      expect(within(secondRepository).getByText('async-library/react-async')).toBeTruthy();

      expect(within(firstRepository).getByText('Build forms in React, without the tears')).toBeTruthy();
      expect(within(secondRepository).getByText('Flexible promise-based React data loader')).toBeTruthy();

      expect(within(firstRepository).getByText('TypeScript')).toBeTruthy();
      expect(within(secondRepository).getByText('JavaScript')).toBeTruthy();

      expect(within(firstRepository).getByText('21.9k')).toBeTruthy();
      expect(within(firstRepository).getByText('1.6k')).toBeTruthy();
      expect(within(firstRepository).getByText('3')).toBeTruthy();
      expect(within(firstRepository).getByText('88')).toBeTruthy();

      expect(within(secondRepository).getByText('1.8k')).toBeTruthy();
      expect(within(secondRepository).getByText('69')).toBeTruthy();
      expect(within(secondRepository).getByText('3')).toBeTruthy();
      expect(within(secondRepository).getByText('72')).toBeTruthy();

    });
  });
});