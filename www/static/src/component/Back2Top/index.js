/**
 * @file Back2Top组件入口
 * @author liuliang<liuliang@w3ctech.com>
 */
/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import App from './App';

const GotoTop = ({
  visibilityHeight,
  onClick,
  target,
  show = true,
}) => (
  <div />
);

GotoTop.propTypes = {
  visibilityHeight: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  target: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default GotoTop;
