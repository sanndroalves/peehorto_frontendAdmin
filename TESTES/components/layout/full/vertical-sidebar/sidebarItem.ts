import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, PlugIcon, BuildingIcon, FilePowerIcon, BoltIcon, ToolIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Início' },
    {
        title: 'Painel',
        icon: LayoutDashboardIcon,
        to: '/'
    },
    { header: 'EFICIêNCIA' },
    {
        title: 'Usinas',
        icon: BoltIcon,
        to: '/usinas/'
    },
    {
        title: 'Carregadores',
        icon: PlugIcon,
        to: '/carregadores/'
    },
    {
        title: 'Manutenções',
        icon: ToolIcon,
        to: '/manutencoes/'
    },

    { header: 'GERENCIAMENTO' },
    {
        title: 'Prédios Públicos',
        icon: BuildingIcon,                               
        to: '/predios/'
    },
    {
        title: 'Relatórios',
        icon: FilePowerIcon,
        to: '/relatorios/'
    },
    // {
    //     title: 'Shadow',
    //     icon: CopyIcon,
    //     to: '/ui/shadow'
    // },
    // { header: 'auth' },
    // {
    //     title: 'Login',
    //     icon: LoginIcon,
    //     to: '/auth/login'
    // },
    // {
    //     title: 'Register',
    //     icon: UserPlusIcon,
    //     to: '/auth/register'
    // },
    // { header: 'Extra' },
    // {
    //     title: 'Icons',
    //     icon: MoodHappyIcon,
    //     to: '/icons'
    // },
    // {
    //     title: 'Sample Page',
    //     icon: ApertureIcon,
    //     to: '/sample-page'
    // },
];

export default sidebarItem;
