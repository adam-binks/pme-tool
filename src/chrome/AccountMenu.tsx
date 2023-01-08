import { ActionIcon, Menu } from "@mantine/core"
import { IconLogout, IconUserCircle } from "@tabler/icons"
import { isEmpty } from "lodash"
import { useFirebase } from "react-redux-firebase"
import { redirect } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

export function AccountMenu({
    
} : {
    
}) {
    const firebase = useFirebase()
    const auth = useAppSelector(state => state.firebase.auth)
    if (isEmpty(auth)) return <></>

    return (
        <Menu>
            <Menu.Target>
                <ActionIcon>
                    <IconUserCircle />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className="z-40">
                <Menu.Label>
                    Logged in as {auth.email}
                </Menu.Label>
                <Menu.Item
                    icon={<IconLogout size={14}/>}
                    onClick={() => {firebase.logout(); redirect("/")}}
                >
                    Sign out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}