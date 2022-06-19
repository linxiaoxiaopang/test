// @/locales/en.js
import locale from 'element-ui/lib/locale/lang/en'

export default {
    ...locale, valid: {
        email: 'email', suffix: 'is required', default: 'data', hello: {
            h: 'hellow world'
        }
    }, validTip: {
        number: '',
        isInteger: '',
        intFloat: '',
        notNFloating: '',
        money: '',
        notChinese: '',
        username: '',
        email: 'Please enter a valid email address',
        passwordRobust: 'Passwords must be at least 8 and no more than 16 characters in length，including one uppercase letter, one lowercase letter and one number.',
        lowerCase: '',
        telephone: '',
        alphabets: '',
        commonCharacters: '',
        numberAndLetter: '',
        commonCharactersAndPoint: '',
        blankPassword: '',
        idNumber: '',
        notAllIsNumber: '',
        userNameProhibited: 'Username cannot contain prohibited words. Please reset it.', //用户名违禁词
        'username2-30': 'Username must be at least 2 and no more than 30 characters in length.'
    },

    //弹窗提示
    msg: {
        success: '操作成功'
    },


    column: {
        username: 'Email', email: 'Email', password: 'Password', fullName: 'Full name'
    },

    //公共组件
    base: {
        upload: {
            describe: 'Add your order data file'
        }, folder: {
            placeholder: 'Please select folder',
            default: 'Default save location',
            tools: 'Manage folders',
            create: 'Create new folder',
            defaultText: 'Default',
            edit: 'Edit',
            remove: 'Remove',
            add: 'Add Subfolder'
        }, msg: {
            title: {
                info: 'This is a info message',
                warn: 'This is a warning message',
                suc: 'This is a success message',
                err: 'This is a error message',
                conf: 'Are you sure?'
            },
            save: 'Save',
            edit: 'Edit',
            conf: 'Confirm',
            cel: 'Cancel',
            suc: 'Operate successfully',
            del: 'Delete',
            delTxt: 'Are you sure you want to delete the row data?'
        }, form: {
            select: 'should be selected', require: 'is required'
        }, step: {
            first: 'Connect your online store',
            second: 'Design products and add products sync to store',
            third: 'After successful sales, we will receive orders synchronously',
            four: 'We produce and send your products to customers'
        }
    }, //自定义组件
    comp: {
        crud: {
            all: 'All',
            search: 'Search',
            reset: 'Reset',
            add: 'Add',
            of: 'of',
            idx: 'Index',
            menu: 'Operate',
            edit: 'Edit',
            del: 'Delete',
            conf: 'Confirm',
            cel: 'Cancel',
            delTxt: 'Are you sure you want to delete the row data?',

            date: {
                start: 'Start Date', end: 'End Date'
            }
        }, form: {
            input: 'Please input', select: 'Please select'
        }, protoCard: {
            new: 'New', bestseller: 'Bestseller'
        }, introduceSwiper: {
            data: [{
                title: 'Diverse products meet your creative ideas',
                subTitle: 'Enjoy the freedom to experiment with your brand and products with no order minimums, expensive equipment, or unsold inventory.',
            }, {
                title: 'Easily add your design to a wide range of products',
                subTitle: 'With our custom design tools, you can easily add your creative designs to T-shirts, backpacks, sneakers and hundreds of other products.',
            }, {
                title: 'Selling locally and',
                subTitle: 'Receive synchronized orders from multiple stores and Toaddit responds efficiently to your production shipments.',
            }]
        }, uploadProShow: {
            addImage: 'Add Image'
        }
    }, //页面
    page: {
        login: {
            title: 'Welcome to Toaddit',
            remark: 'Login and Create your account ,you agree with toaddit Term of Service and Privacy Policy ,Thanks',
            withEmail: 'Or with email',
            account: 'Need an account?',
            signUp: 'Sign up',
            forgetPassword: 'Forgot password？',
            option: {
                submitText: 'login'
            }
        },

        register: {
            title: 'Welcome to Toaddit',
            remark: 'By clicking Sign up you agree to toaddit Term of Service and Privacy Policy',
            withEmail: 'Or with email',
            account: 'Have an account?',
            login: 'Login',
            msgTip: {
                agreement: '请先选择协议，再进行此操作！', resetSuccess: '密码重置成功，前往登录！'
            },
            option: {
                submitText: 'Sign up'
            }
        },

        forgetPassword: {
            title: 'Password reset',
            subTitle: 'Login and Create your account ,you agree with toaddit Term of Service and Privacy Policy ,Thanks',
            account: 'Return to',
            login: 'Login',
            successAlert: 'We just sent an email with password reset instructions to duanredmay@126.com',
            successTip: 'Click the link in the email to reset your password. If you don’t see the email, check your Spam folder.',
            resend: 'Resend Verification Mail',
            msgTip: {},
            option: {
                submitText: 'Send reset email'
            }
        },

        odr: {
            all: 'All',
            nsy: 'Not Synced',
            unp: 'Unpaid',
            top: 'To be paid',
            awp: 'Awaiting Production',
            inp: 'In production',
            ship: 'Shipped',
            dvr: 'Delivered',
            cpt: 'Completed',
            cel: 'Canceled',
            ret: 'Return',
            ref: 'Refund',
            fail: 'Failed',

            rod: 'Refresh order data',
            co: 'Create order',
            oi: 'Order import',
            oc: 'Confirm',
            Rel: 'Related',

            ords: 'orders',
            ct: 'Check out',

            eop: 'Enter order id or product sku',

            o: 'Order',

            t: {
                str: 'Store', oid: 'Order ID', cus: 'Customer', sta: 'Status', tra: 'Tracking', tot: 'Total', d: 'Date',

                pro: 'Products', sm: 'Shipping Method', ads: 'Address',

                oi: 'Order items', cs: 'Color/Size', sku: 'SKU', qua: 'Quantity', up: 'Unit Price'
            }
        }, folder: {
            name: 'Folder name',
            warning: 'The folder name may not be greater than 64 characters',
            change: 'Change folder',
            download: 'Download files',
            del: 'Delete',
            edit: 'Edit folder name',
            remove: 'Are you sure you want to remove this folder?',
            add: 'Add subfolder',
            create: 'Create new folder',
            cancel: 'Cancel',
            save: 'Save',
            sub: 'Subfolder name',
            lenLimit: 'Please enter 2-30 characters',
            remTip: 'All pictures in the folder will be completely deleted and cannot be recovered.',
            success: 'Operation succeeded',
            rem: 'Yes,remove',
            sel: 'Please select picture first',
            noVal: 'Sorry, there are no valid pictures',
            information: 'Image Information',
            delete: 'Yes,delete',
            conDel: 'Are you sure you want to delete this explain?',
            imgName: 'Image name',
            imgReq: 'Image name is required',
            less200: 'Image name can not be longer than 200 characters.',
            down: 'Download File',
            design: 'Product design',
            disabled: 'Image is disabled',
            unDown: 'Unable to download disabled explain',
            upload: 'Upload new file',
            uploading: 'Uploading...'
        }, productTemplates: {
            dropdownList: [{
                label: 'Edit Product details', value: '0'
            }, {
                label: 'Mockup Download', value: '1'
            }, {
                label: 'Redesign', value: '2'
            }, {
                label: 'Delete', value: '3'
            }], option: {
                column: {
                    orderCode: {
                        searchPlaceholder: 'Templates name,product name'
                    }, first: {
                        searchPlaceholder: 'Created：newest first'
                    }
                }
            }
        }, allProducts: {
            productDetail: {
                countrySelect: 'Search for products'
            }
        },

        account: {
            myAct: 'My Account',
            edit: 'Edit',
            save: 'Save',
            cancel: 'Cancel',
            changePwd: 'Change password',
            connect: 'Connect',
            disconnect: 'Disconnect',

            t: {
                personalInfo: 'Personal information',
                pwd: 'Password',
                socialActs: 'Social accounts',
                fullName: 'Full name',
                email: 'Email',
                phone: 'Phone',
                confirmPwd: 'Confirm Password'
            }
        },

        address: {
            addr: 'Address',
            add: 'Add address',
            edit: 'Edit Address',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            del: 'Yes,delete',
            warning: 'Are you sure you want to delete this address?',
            info: 'Please add the address to use when creating an order .',

            t: {
                fullName: 'Full name',
                phone: 'Phone',
                country: 'Country',
                state: 'State/Province/Region',
                addr1: 'Address1',
                addr2: 'Address2(optional)',
                city: 'City',
                code: 'ZIP code'
            }
        },

        //定制产品详情页
        productsDetail: {
            recommendTitle: 'You might also like'
        },

        //定制器
        designContainer: {
            header: {
                title: 'Creat a product template',
                layers: 'Layers',
                easyMode: 'Easy Mode',
                standardMode: 'Standard Mode'
            }, tabs: {
                allProducts: 'Catalog', //公共图片
                myImage: 'Image', //我的图片
                designLibrary: 'Discover', background: 'Background'
            }, background: {
                applyAll: 'applyAll'
            }, main: {
                recommendedImageSize: 'Recommended Image Size', printQuality: 'Print quality', low: 'Low', high: 'High'
            }, operation: {
                pictureOperation: 'Picture operation', //无图片下提示
                operationalRequirements: 'Operational requirements',
                case1: 'case1',
                case2: 'case2', //定制提示
                case1Tip: 'Please make sure your text or important elementsare placed in a safe area.',
                case2Tip: 'Be sure to cover your picture with solid lines toavoid white edges during sewing.', //图片操作
                layerOrder: {
                    title: 'Arrange', iconTip: {
                        bringToFront: 'Bring to Front',
                        sendToBack: 'Send to Back',
                        bringForward: 'Bring Forward',
                        sendBackward: 'Send Backward',
                        duplicate: 'Duplicate',
                        delete: 'Delete'
                    }
                },
                align: {
                    title: 'Align', iconTip: {
                        leftEdges: 'Left Edges',
                        horizontal: 'Horizontal ',
                        rightEdges: 'Right Edges',
                        topEdges: 'Top Edges',
                        verticalCenter: 'Vertical Center',
                        bottomEdges: 'Bottom Edges'
                    }
                },
                rotate: {
                    title: 'Rotate', iconTip: {
                        rotate30Degrees: 'Rotate 30 Degrees',
                        'Rotate-30Degrees': 'Rotate -30 Degrees',
                        flipHorizontal: 'Flip Horizontal',
                        flipVertical: 'Flip Vertical'
                    }
                },
                scale: {
                    title: 'Scale'
                },
                stretch: {
                    title: 'Stretch', iconTip: {
                        adapt: 'Adapt',
                        fill: 'Fill',
                        maximumWidth: 'Maximum Width',
                        maximumHeight: 'Maximum Height',
                        stretching: 'Stretching'
                    }
                },
                tiling: {
                    title: 'Tiling', iconTip: {
                        normal: 'Normal',
                        basic: 'Basic',
                        mirror: 'Mirror',
                        halfBrick: 'Half Brick',
                        halfDrop: 'Half Drop'
                    }
                },
                spacing: {
                    title: 'Spacing'
                },
                globalPreview: 'Global Preview',
                preview: 'Preview',
                save: 'Save'
            }
        },

        helpCenter: {
            caption: 'Toaddit Help center', placeholder: 'How to Integrate with Shopify'
        },

        howItWorks: {
            design: {
                title: 'Sell your design ideas in minutes',
                description: 'Create products with your design and sell everywhere, we',
                start: 'Get started'
            },

            steps: {
                title: 'Enjoy Toaddit services in 4 easy steps', list: [{
                    title: 'Pick a product',
                    description: 'We have more than 300 products in our catalog, such as t-shirts,mugs, socks and home decorations, ' + 'ready to be customized for you.Our strengths are footwear products, and a variety of white boards allow you to pick out the best fit for your business.'
                }, {
                    title: 'Custom design',
                    description: 'Use our free mockup generator to apply your designs to a product of your choice. ' + 'Easily upload your designs and preview products on high-quality explain. This mockup is designed to easily add products to your online store.'
                }, {
                    title: 'Synchronized products', description: `Once you' re happy with your custom product, you can automatically publish it to your online store.
          Toaddit has integrated with leading e-commerce platforms like Amazon,AliExpress, Ebay, etc., so you can sell it to millions of online shoppers effortlessly.`
                }, {
                    title: 'Production and shipment',
                    description: 'When you make a sale and your product passes quality control,it is sent to production and then shipped directly to your customers. ' + 'You can easily follow this process from your Toaddit account. Focus on growing your brand while we take care of the other steps.'
                }]
            },

            start: {
                title: 'Ready to start designing?', btn: 'Get start'
            },

            services: {
                title: 'Drop shipping services', description: 'The easiest way to start your online store'
            },

            orders: {
                title: 'Heres how we ship your Orders', list: [{
                    count: '①',
                    title: ' Fulfillment',
                    info: 'It takes 2-7 business days to create a product and fulfill an order'
                }, {
                    count: '②',
                    title: ' Shipping',
                    info: 'The average shipping time is 15 business days depending on the delivery destination'
                }, {
                    count: '③',
                    title: ' Delivery',
                    info: 'Once the order is fulfilled and shipped  out, it s delivered to the end address'
                }]
            },

            definition: {
                title: 'What is drop shipping by definition?',
                description: 'No need to think about inventory or storage, just you and your business.',
                detail: 'Using our platform services, you can sell products in online stores through product suppliers. '
            },

            store: {
                operate: 'Are you ready to start creating your personal store?', btn: 'Choose your product'
            },

            about: {
                title: 'Toaddit', list: [{
                    title: 'About us', children: [{
                        subTitle: 'Privacy Policy'
                    }, {
                        subTitle: 'User Agreement'
                    }]
                }, {
                    title: 'Support', children: [{
                        subTitle: 'How it works'
                    }, {
                        subTitle: 'Connect your store'
                    }, {
                        subTitle: 'Return policy'
                    }]
                }, {
                    title: 'Contact', children: [{
                        subTitle: 'Email: support@zdcustom.com'
                    }, {
                        subTitle: 'Phone: +84888 553888'
                    }]
                }]
            },

            rights: {
                content: '©Toaddit Inc.All rights reserved.'
            }
        },

        topic: {
            create: {
                title: 'Create & Sell your custom products online',
                description: 'Based on years of traditional cross-border e-commerce ' + 'experience, more professional and customized Amazon andAliExpress industry solutions',
                subTitle: '300+ custom products -Easy to use - No inventory',
                start: 'Start selling',
                design: 'Design',
                itemShip: 'Over 1 million items shipped every month',
                time: 'Agra,IN 24min ago'
            },

            sell: {
                title: 'How to sell your designs with Toaddit', list: [{
                    title: 'Customized on demand',
                    description: 'Choose a variety of styles of products for personalized customization,Low printing cost and good quality.'
                }, {
                    title: 'Online selling',
                    description: 'Place an order, associate other store orders, and update in real time Order Status.'
                }, {
                    title: 'We Print & ship to Your  ',
                    description: 'One-piece delivery, no inventory, accurate delivery to customers,Save your time and energy.'
                }]
            },


            design: {
                title: 'Add your designs to various products',
                description: 'With our customization tools, you can easily add designs to shoes, bags, clothes, phone cases and hundreds of other products.',
                btn: 'Design'
            },

            marketplace: {
                title: 'We have integrated marketplace Ecommerce platforms',
                description: 'More marketplace integration is coming soon'
            },

            merchants: {
                title: 'Trusted by over 30,000 merchants', description: 'Whether you', list: [{
                    name: 'Luke - Dunphy',
                    origin: 'Ecommerce vendors',
                    experience: 'Affected by the epidemic, overseas business development has stagnated.Fortunately,Toaddit launched new products in time,which made me catch up with a wave ofcrazes.l hope the platform can always maintain this market sensitivity.'
                }, {
                    name: 'Philo Pappas',
                    origin: 'Amazon sellers',
                    experience: 'As our business grows,Toaddit has been a great partner.Has been very prompt withour orders and any problems we may have,the quality is good, and our store has built up a good reputation for quality merchandise.'
                }, {
                    name: 'Bella Andreas',
                    origin: 'Express seller',
                    experience: 'Wonderful service.Highly recommend.Toaddit is easy to use and provides a lot of variety.They have the best t-shirts and theirprinting is spot on.I'
                }]
            },

            start: {
                title: '0 Inventory · 0 Startup Capital · Free Design One-' + 'ClickGenerated · One piece drop shipping',
                btn: 'Start selling'
            }
        }
    }
}
