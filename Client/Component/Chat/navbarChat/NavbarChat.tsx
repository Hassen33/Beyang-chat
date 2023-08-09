import React, { useState } from 'react'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles, useTheme } from '@mui/styles';
import { styled } from '@mui/styles';


const useStyles = makeStyles(() => ({
    defaultIcon: {
      cursor:'pointer',
      width:'15%',
      display:'flex',
      justifyContent:'center',
      color : '#83868A',
      fontSize:'30px',
      padding:'10px 0'
    },
    clickedIcon: {
        borderBottom:'2px solid #303E65',
        color : '#303E65'
    },
  }));
const NavbarChat = (props) => {
    const classes = useStyles();
    const [selectedIcon, setSelectedIcon] = useState('contact');
    
    const handleClick = (icon) => {
        setSelectedIcon(icon);
        props.selected(icon);
      };

      const getIconClasses = (icon) => {
        return `${classes.defaultIcon} ${icon === selectedIcon ? classes.clickedIcon : ''}`;
      };
    
  return (
    <div style={{ display:'flex',backgroundColor:'E6F4F2',justifyContent:'space-evenly'}}>
        <span className={getIconClasses('contact')} onClick={() => handleClick('contact')}>
          <SmsOutlinedIcon />
        </span>
        <span className={getIconClasses('group')} onClick={() => handleClick('group')}>
          <PeopleAltOutlinedIcon  />
        </span>
        <span className={getIconClasses('fav')} onClick={() => handleClick('fav')}>
          <StarBorderOutlinedIcon  />
        </span>
        <span className={getIconClasses('search')} onClick={() => handleClick('search')}>
          <SearchIcon  />
        </span>
        
    </div>
  )
}

export default NavbarChat