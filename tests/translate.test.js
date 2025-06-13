import { translateText } from '../src/utils/translate'; // Adjust the path based on your project structure
import axios from 'axios';

// Mock the axios.post method used in translateText
jest.mock('axios');

describe('translateText function tests', () => {
  // Test case for valid translation (e.g., English to Spanish)
  it('should translate English to Spanish', async () => {
    const mockResponse = { data: { translatedText: 'Hola, ¿cómo estás?' } };
    axios.post.mockResolvedValueOnce(mockResponse);  // Mocking successful translation response

    const result = await translateText('Hello, how are you?', 'en', 'es');
    expect(result).toBe('Hola, ¿cómo estás?');  // Expecting translated result
  });

  // Test case for network failure simulation
  it('should handle network failure gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));  // Mocking network error

    const result = await translateText('Hello', 'en', 'es');
    expect(result).toBe('Hello');  // Expect original text due to failure
  });

  // Test case for unexpected API response structure
  it('should handle unexpected API response structure', async () => {
    const mockResponse = { data: { someRandomKey: 'unexpectedData' } };
    axios.post.mockResolvedValueOnce(mockResponse);  // Mocking an unexpected response

    const result = await translateText('Hello', 'en', 'es');
    expect(result).toBe('Hello');  // Expecting original text due to unexpected response
  });

  // Test case for unsupported language
  it('should handle unsupported target language', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unsupported target language'));

    const result = await translateText('Hello', 'en', 'xyz');  // Invalid language
    expect(result).toBe('Hello');  // Expect original text due to unsupported language
  });

  // Test case for empty input
  it('should handle empty input gracefully', async () => {
    const result = await translateText('', 'en', 'es');  // Empty message
    expect(result).toBe('');  // Expect empty string as result
  });

  // Test case for invalid input (non-string input)
  it('should handle non-string input gracefully', async () => {
    const result = await translateText(12345, 'en', 'es');  // Non-string input
    expect(result).toBe(12345);  // Expect the same input back
  });
});
