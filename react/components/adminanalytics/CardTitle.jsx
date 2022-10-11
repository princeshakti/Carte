import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { HiDotsVertical } from 'react-icons/hi';

const cardTitle = ({ title, containerClass, menuItems }) => {
    return (
        <>
            <div className={classNames(containerClass)}>
                {typeof title === 'string' ? <h4 className="header-title">{title}</h4> : title}
                <Dropdown>
                    <Dropdown.Toggle as={Link} to="#" className="arrow-none card-drop">
                        <HiDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        {(menuItems || []).map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {item.hasDivider && <Dropdown.Divider as="div" />}
                                    <Dropdown.Item className={classNames(item.variant ? item.variant : '')}>
                                        {item.icon && <HiDotsVertical />}
                                        {item.label}
                                    </Dropdown.Item>
                                </React.Fragment>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    );
};

cardTitle.propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    containerClass: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

export default cardTitle;
