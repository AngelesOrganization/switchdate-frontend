
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

import styles from './sidebar.module.css';

export default function SidebarCustom() {
    const [visible, setVisible] = useState(false);

    return (
        <div >
            <Sidebar className={styles.custom_sidebar} visible={visible} onHide={() => setVisible(false)}>
                <BasicDemo></BasicDemo>
            </Sidebar>
            <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
    )
}


export function BasicDemo() {
    let items = [
        {label: 'New', icon: 'pi pi-fw pi-plus'},
        {label: 'Delete', icon: 'pi pi-fw pi-trash'}
    ];

    return (
        <Menu model={items} />
    )
}
        
        