// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import HeaderItem from '../HeaderItem';

test('HeaderItem component renders', () => {
  const output = shallow(<HeaderItem>My name is Ed</HeaderItem>);
  expect(toJson(output)).toMatchSnapshot();
});

test('HeaderItem handles click', () => {
  const click = jest.fn();
  const output = shallow(<HeaderItem onClick={click}>My name is Ed</HeaderItem>);

  output.simulate('click');
  expect(click).toHaveBeenCalled();
});