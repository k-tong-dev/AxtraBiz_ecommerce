'use client'

import {Bell, ChevronDown, User, UserIcon} from 'lucide-react'
import {useAuth} from '@/hooks/use-auth'
import {Dropdown, Modal} from 'rsuite'
import {Button} from '@/components/ui/button'
import {
    IoEarthOutline
} from "react-icons/io5";
import {MdCancel, MdLogout} from "react-icons/md";
import {useState} from 'react'
import {Cancel} from "@radix-ui/react-alert-dialog";

export function AdminTopNavbar() {
    const {user, logout} = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleLogout = () => {
        logout()
        setShowLogoutModal(false)
        window.location.href = '/'
    }

    return (
        <>
            <div className="sticky top-0 z-40 px-4 py-3 md:px-6">
                <div className={"ml-auto flex w-fit items-center gap-2 " +
                    "rounded-full border border-border/60 bg-background/85 " +
                    "px-3 py-1 backdrop-blur-sm shadow-sm"}>
                    <Button
                        className="rounded-full"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5"/>
                    </Button>

                    <Dropdown
                        title={
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                                  <User className="h-4 w-4"/>
                                </span>
                                                <span className="max-w-[120px] truncate text-sm font-medium">
                                  {user?.name ?? 'Admin'}
                                </span>
                            </div>
                        }
                        placement="bottomEnd"
                    >
                        <Dropdown.Item
                            icon={<UserIcon className={'w-4 h-4'}/>}>Profile</Dropdown.Item>
                        <Dropdown.Item
                            icon={<IoEarthOutline/>} onClick={() => window.open('/', '_blank')}>Website</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setShowLogoutModal(true)}
                            icon={<MdLogout/>}
                            color={"red"}>
                          Logout
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                backdrop={"static"}
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                size="sm"
            >
                <Modal.Header>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to logout? You will need to login again to access the admin panel.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        endIcon={<MdCancel/>}
                        onClick={() => setShowLogoutModal(false)}
                        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance={"primary"}
                        color={"red"}
                        onClick={handleLogout}
                        className="ml-2"
                        endIcon={<MdLogout/>}
                    >
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
