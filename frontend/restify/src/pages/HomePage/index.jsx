import RevListGuest from "../../components/Reservation/RevListGuest";
import RevListHost from "../../components/Reservation/RevListHost";
import Notifications from "../../components/Notification/NtfList";
import './style.css'
function HomePage() {
    return (
        <main>
            <div className="cards">
                <Notifications />
                <RevListGuest />
                <RevListHost />
            </div>
        </main>

    );
}
export default HomePage;