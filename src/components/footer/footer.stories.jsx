import React from 'react';
import { storiesOf } from '@storybook/react';

import { getWrapperDecorator } from '../../stories';
import { Footer } from '.';

const stories = storiesOf('Components/Footer', module);
stories.addDecorator(getWrapperDecorator());

stories.add('default', () => (
  <Footer />
));
