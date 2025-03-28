// import React, { memo, useState, useEffect } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import translations from 'ckeditor5/translations/ko.js';
import "@/css/commonEditor.css";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";

/**
 *
 * */

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Emoji,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    // SourceEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';


const CommonEditor = memo(({ value, onChange}) => {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const customUploadAdapter = (loader) => {
        return {
            upload : async () => {
                return new Promise ((resolve, reject) => {
                    const formData = new FormData();
                    loader.file.then( (file) => {
                        formData.append("files", file);
                        const requestOptions = {
                            method: "POST",
                            body: formData
                        };
                        EgovNet.requestFetch("/commonApi/setCkEditorFiles", requestOptions, (resp) => {
                            if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                resolve({
                                    default: window.location.origin + resp.result.files[0].atchFilePathNm +
                                        resp.result.files[0].strgFileNm + "." +
                                        resp.result.files[0].atchFileExtnNm
                                })
                            } else {
                            }
                        });

                    })
                });
            }
        }
    }

    function customUploadPlugin ( editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        }
    }

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        // 'emoji',
                        // 'link',
                        "uploadImage",
                        'mediaEmbed',
                        'insertTable',
                        'blockQuote',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent',
                        // 'sourceEditing',
                    ],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    BlockQuote,
                    Bold,
                    CloudServices,
                    Emoji,
                    Essentials,
                    Heading,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    MediaEmbed,
                    Mention,
                    Paragraph,
                    PasteFromOffice,
                    // SourceEditing,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    TodoList,
                    Underline
                ],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage'
                    ]
                },
                licenseKey: 'GPL',
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                mention: {
                    feeds: [
                        {
                            marker: '@',
                            feed: [
                                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                            ]
                        }
                    ]
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                },
                translations : [translations],
                extraPlugins: [customUploadPlugin]
            }
        };
    }, [isLayoutReady]);

    return (
        <div className="main-container">
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>{editorConfig && <CKEditor editor={ClassicEditor} data={value} onChange={(event, editor) => onChange(editor.getData())} config={editorConfig} />}</div>
                </div>
            </div>
        </div>
    );


    //
    // useEffect(() => {
    //     import('@ckeditor/ckeditor5-react').then((module) => {
    //         setEditorLoaded(true);
    //     });
    // }, []);
    //
    // return (
    //     <>
    //     {editorLoaded ? (
    //         <CKEditor
    //             editor={ClassicEditor}
    //             data={value}
    //             onChange={(event, editor) => onChange(editor.getData())}
    //
    //             config={{
    //                 licenseKey: "GPL",
    //                 language: 'ko',
    //                 translations: [translations],
    //                 extraPlugins: [customUploadPlugin]
    //
    //             }}
    //         />
    //     ) : (<p>에디터를 로딩중입니다.</p>)
    //     }
    //     </>
    // );

});

export default CommonEditor;