/**
 * @file NotFound组件入口
 * @author liuliang<liuliang@w3ctech.com>
 */
/* eslint-disable react/prefer-stateless-function */

import React, { PureComponent } from 'react';
import App from './App';

export default class NotFound extends PureComponent {
  render() {
    return (
      <div>
        <App>
          <span>Not Found</span>
        </App>
      </div>
    );
  }
}
