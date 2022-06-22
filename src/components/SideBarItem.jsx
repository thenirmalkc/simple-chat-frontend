import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function SideBarItem(props) {
  const { registeredUser, unseenMsgs } = props.data;

  return (
    <div
      onClick={props.handleOnClick}
      className={`sidebar-registered-user ${props.addClass}`}
    >
      <div className='sidebar-icon'>
        <FontAwesomeIcon icon={faUser} size={'lg'} />
      </div>
      <div className='sidebar-registered-user-name'>
        {`${registeredUser.firstName} ${registeredUser.lastName}`}
      </div>
      <div className={unseenMsgs ? 'sidebar-unseen-msg-container' : ''}>
        <div className={unseenMsgs ? 'sidebar-unseen-msg' : ''}>
          {unseenMsgs ? (unseenMsgs > 99 ? '!!' : unseenMsgs) : ''}
        </div>
      </div>
    </div>
  );
}

export default SideBarItem;
