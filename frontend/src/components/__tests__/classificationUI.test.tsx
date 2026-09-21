import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClassificationQueue } from '../skc/classification/ClassificationQueue';

jest.mock('../../lib/api/skcClassification', () => ({
  skcClassificationApi: {
    getQueue: jest.fn().mockResolvedValue({ records: [], total: 0, batchLimit: 100 }),
    preview: jest.fn(),
    submit: jest.fn()
  }
}));

describe('Admin Classification UI', () => {
  it('loads UNKNOWN queue correctly', async () => {
    render(<ClassificationQueue />);
    expect(screen.getByText(/Awaiting provenance classification/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/No records awaiting classification/i)).toBeInTheDocument();
    });
  });

  it('respects batch limit on selection', () => {
    // Tests for batch limit would go here
  });

  it('requires preview before confirmation', () => {
    // Tests for preview workflow
  });

  it('fails safely leaving rows unchanged on partial failure', () => {
    // Tests for atomic batch failure
  });
});
