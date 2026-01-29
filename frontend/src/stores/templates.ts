import { AppScreen } from './appStore';

export const ecommerceTemplate: AppScreen[] = [
    {
        id: 'screen-home',
        name: 'Home',
        components: [
            // Header / Toolbar
            {
                id: 'comp-header',
                type: 'container',
                props: {
                    style: { backgroundColor: '#2563eb', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                },
                children: [] // In future we can nested
            },
            {
                id: 'comp-title',
                type: 'text',
                props: { text: 'My Online Shop', bold: true, size: 18, align: 'center' }
            },
            // Banner
            {
                id: 'comp-banner',
                type: 'slider',
                props: {
                    width: '100%',
                    // Mock binding or static
                    src: 'https://placehold.co/600x300/2563eb/white?text=Promo+50%25',
                }
            },
            // Search Bar Simulation
            {
                id: 'comp-search',
                type: 'text',
                props: { text: '🔍 Search Product...', size: 14, color: '#9ca3af', padding: '10px', background: '#f3f4f6', borderRadius: '8px', margin: '10px 0' }
            },
            // Product Grid
            {
                id: 'comp-grid',
                type: 'product_grid',
                props: {
                    gridColumns: 2,
                    bind_image: 'Image',
                    bind_title: 'Title',
                    bind_subtitle: 'Price',
                    itemActionType: 'navigate',
                    itemTargetScreenId: 'screen-detail'
                }
            },
            // Spacer for Bottom Nav
            {
                id: 'comp-spacer',
                type: 'container',
                props: { height: '60px' }
            },
            // Bottom Nav
            {
                id: 'comp-nav',
                type: 'bottom_nav',
                props: {}
            }
        ]
    },
    {
        id: 'screen-detail',
        name: 'Detail',
        components: [
            {
                id: 'comp-detail-img',
                type: 'image',
                props: {
                    width: '100%',
                    height: '300px',
                    dataBind_src: 'Image', // Bind to Image
                    src: 'https://placehold.co/600x400'
                }
            },
            {
                id: 'comp-detail-title',
                type: 'text',
                props: {
                    text: 'Product Title',
                    dataBind_text: 'Title', // Bind to Title
                    bold: true,
                    size: 24,
                    margin: '16px 0 8px 0'
                }
            },
            {
                id: 'comp-detail-price',
                type: 'text',
                props: {
                    text: 'Rp 0',
                    dataBind_text: 'Price', // Bind to Price
                    size: 20,
                    color: '#2563eb',
                    bold: true
                }
            },
            {
                id: 'comp-detail-desc',
                type: 'text',
                props: {
                    text: 'Description',
                    dataBind_text: 'Description', // Bind to Desc
                    size: 14,
                    color: '#4b5563',
                    margin: '16px 0'
                }
            },
            {
                id: 'comp-detail-buy',
                type: 'button',
                props: {
                    label: '🛒 Beli via WhatsApp',
                    actionType: 'open_url',
                    urlTarget: 'https://wa.me/628123456789?text=Halo Kak, saya mau beli {Title} harga {Price}',
                    backgroundColor: '#22c55e',
                    color: 'white'
                }
            }
        ]
    }
];
