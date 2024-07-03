
precision highp float;

const vec4 cons1 = vec4(0.800000011921, 0.800000011921, 0.800000011921, 1.000000000000);

uniform sampler2D uDiffuseMap;
uniform float uTime;
uniform vec2 uResolution;

varying vec3 Normal;
varying vec2 TexCoord;
varying vec3 Position;

float clamp01(float value){
    return clamp(value,0.0,1.0);
}

void material_preview_matcap(sampler2D ima,  vec4 mask, out vec4 result)
{
	vec2 tex = vec2(0,0);
    
	tex.x =  0.5 + 0.5 * Normal.x;
	tex.y =  0.5 + 0.5 * Normal.y;
    
	result = texture2D(ima, tex) * mask;
}

void main()
{
	vec4 tmp5;
	vec4 mask;
	// vec2 screenUV = uResolution / gl_FragCoord.xy;
	vec2 screenUV = gl_FragCoord.xy / uResolution;

	vec3 col = vec3(0.1019, 0.3254, 0.0980);
	// vec3 col = vec3(0.9,0.9,0.9) * 1.10;

	mask = vec4(1.0, 1.0, 1.0, 1.0);
	material_preview_matcap(uDiffuseMap,  mask, tmp5);
    
	// tmp5 = mix(tmp5, vec4(col,1.0), 0.65);
	tmp5 = mix(tmp5, vec4(col,1.0), 0.965);
	// tmp5 *= vec4(col,1.0);

	// dAlpha = 0.5;
	float midMask = smoothstep(0.45,0.955,screenUV.y);
	float alpha = smoothstep(0.0,0.5,1.-TexCoord.y);
	// float alpha = clamp01( smoothstep(0.0,0.5,1.-TexCoord.y) - midMask );


	// tmp5 = vec4(screenUV,0.0,0.0);
	// tmp5 = vec4(midMask,midMask,midMask,1.);

    gl_FragColor =  vec4(tmp5.rgb, alpha);
}

