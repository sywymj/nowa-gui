/*
  项目列表子项
*/
import React, { PropTypes } from 'react';
import { shell } from 'electron';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Badge from 'antd/lib/badge';
import Dropdown from 'antd/lib/dropdown';
import { confirm } from 'antd/lib/modal';
import classnames from 'classnames';
import { join } from 'path';

import i18n from 'i18n-renderer-nowa';
import { PROJECT_PAGE } from 'const-renderer-nowa';
import { hideBoilerplateDesp } from 'util-renderer-nowa';


const Item = ({
  project,
  projPath = '',
  dispatch
}) => {
  const { name, path, start, taskErr } = project;
  const isActive = projPath === path;

  // 点击项目的时候，切换控制台的输出type为start，切换页面到项目详情页
  const handleClick = () => {
    dispatch({
      type: 'project/changeStatus',
      payload: {
        current: { ...project }
      }
    });
    dispatch({
      type: 'task/changeStatus',
      payload: {
        taskType: 'start'
      }
    });
    dispatch({
      type: 'layout/changeStatus',
      payload: {
        showPage: PROJECT_PAGE,
      }
    });
  };

  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      confirm({
        title: i18n('msg.removeTip'),
        onOk() {
          dispatch({
            type: 'project/remove',
            payload: project
          });
        },
        onCancel() {},
        okText: i18n('form.ok'),
        cancelText: i18n('form.cancel'),
      });
    }

    if (key === '2') {
      shell.showItemInFolder(join(project.path, 'package.json'));
    }
    if (key === '3') {
      dispatch({
        type: 'project/reload',
        payload: project
      });
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">{i18n('task.remove')}</Menu.Item>
      <Menu.Item key="2">{i18n('task.folder')}</Menu.Item>
      <Menu.Item key="3">{i18n('task.reload')}</Menu.Item>
    </Menu>
  );

  let status;

  if (taskErr) {
    status = <Badge status="warning" />;
  } else if (start) {
    status = <Badge status="processing" />;
  } else {
    status = <Badge status="default" />;
  }

  return (
    <div
      className={classnames({
        'project-list-item': true,
        'project-list-item-active': isActive
      })}
      onClick={handleClick}
    >
      { isActive &&
        <Dropdown
          overlay={menu}
          trigger={['click']}
          className="project-list-item-down"
        >
          <Icon type="down" />
        </Dropdown>
      }
      { status }
      <div className="project-list-item-name">{ hideBoilerplateDesp(name, 20) }</div>
    </div>
  );
};

Item.propTypes = {
  projPath: PropTypes.string,
  project: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Item;