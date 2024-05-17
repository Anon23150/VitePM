import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddProduct from './AddProduct';
import { describe, it, expect } from 'vitest';

describe('AddProduct Component', () => {
  it('renders AddProduct component', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AddProduct />
      </BrowserRouter>
    );

    expect(getByLabelText('ชื่อสินค้า:')).toBeDefined();
    expect(getByLabelText('ราคา:')).toBeDefined();
    expect(getByLabelText('รายละเอียด:')).toBeDefined();
    expect(getByLabelText('จำนวน:')).toBeDefined();
    expect(getByLabelText('ประเภท:')).toBeDefined();
  });

  it('Verify that the fields are rendered', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AddProduct />
      </BrowserRouter>
    );

    expect(getByLabelText('ชื่อสินค้า:')).toBeDefined();
    expect(getByLabelText('ราคา:')).toBeDefined();
    expect(getByLabelText('รายละเอียด:')).toBeDefined();
    expect(getByLabelText('จำนวน:')).toBeDefined();
    expect(getByLabelText('ประเภท:')).toBeDefined();
  });

  it('test input fields', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <AddProduct />
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText('ชื่อสินค้า:'), { target: { value: 'Product A' } });
    fireEvent.change(getByLabelText('ราคา:'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('รายละเอียด:'), { target: { value: 'Description for Product A' } });
    fireEvent.change(getByLabelText('จำนวน:'), { target: { value: '10' } });
    fireEvent.change(getByLabelText('ประเภท:'), { target: { value: 'Category A' } });
  });
});
