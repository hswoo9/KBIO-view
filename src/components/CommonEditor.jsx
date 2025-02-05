import React, { memo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import translations from 'ckeditor5/translations/ko.js';
import "@/css/commonEditor.css";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";

const CommonEditor = memo(({ value, onChange}) => {

    const [editorLoaded, setEditorLoaded] = useState(false);

    const customUploadAdapter = (loader) => {
        return {
            upload(){
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
                               console.log(resp);
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

    useState(() => {
        import('@ckeditor/ckeditor5-react').then((module) => {
            setEditorLoaded(true);
        });
    }, []);

    return (
        <>
        {editorLoaded ? (
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onChange={(event, editor) => onChange(editor.getData())}

                config={{
                    licenseKey: "GPL",
                    language: 'ko',
                    translations: [translations],
                    extraPlugins: [customUploadPlugin]

                }}
            />
        ) : (<p>에디터를 로딩중입니다.</p>)
        }
        </>
    );

});

export default CommonEditor;