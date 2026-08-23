import SessionDropdown from 'flarum/forum/components/SessionDropdown';
export default class MobileTabSessionDropdown extends SessionDropdown {
    getButtonContent(): (string | JSX.Element)[];
}
