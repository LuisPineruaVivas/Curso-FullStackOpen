import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInForm } from '../components/SignIn';
import {expect, jest} from '@jest/globals';

const mockOnSubmit = jest.fn();


describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button
      render(<SignInForm onSubmit={mockOnSubmit}/>);

      fireEvent.changeText(screen.getByPlaceholderText('Username'), 'username');
      fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
      fireEvent.press(screen.getByText('Sign In'));

      // wait for the onSubmit function to be called
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ username: 'username', password: 'password' });
      });
    });
  });
});