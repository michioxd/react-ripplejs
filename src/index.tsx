import React, { HTMLAttributes, useCallback, useEffect, useRef } from "react";
import styleSetup from "./styleSetup";

interface RippleJS extends HTMLAttributes<HTMLDivElement> {
    opacity?: string,
    background?: string,
    fill?: boolean
}

var rippleTypeAttr = 'data-event';

export default function Ripple(props: RippleJS) {
    const RippleElementRef = useRef<HTMLInputElement>(null);

    function getHolderWithRippleJsClass(event: MouseEvent | Touch) {
        var holder = /** @type {!Node} */ (event.target);
        if (holder instanceof Element) {
            var childNodesLength = holder.childNodes.length;

            if (holder.localName !== 'button' || !childNodesLength) {
                return holder.classList.contains('rippleJS') ? holder : null;
            }

            // fix firefox event target issue https://bugzilla.mozilla.org/show_bug.cgi?id=1089326
            for (var i = 0; i < childNodesLength; ++i) {
                var child = holder.childNodes[i];
                if (child instanceof Element) {
                    var cl = child.classList;
                    if (cl && cl.contains('rippleJS')) {
                        return child;  // return valid holder
                    }
                }
            }
        }
        return null;
    }

    const startRipple = useCallback((type: string, at: MouseEvent | Touch): boolean => {
        var holder = getHolderWithRippleJsClass(at);
        if (!holder) {
            return false;  // ignore
        }
        var cl = holder.classList;

        // Store the event use to generate this ripple on the holder: don't allow
        // further events of different types until we're done. Prevents double-
        // ripples from mousedown/touchstart.
        var prev = holder.getAttribute(rippleTypeAttr);
        if (prev && prev !== type) {
            return false;
        }
        holder.setAttribute(rippleTypeAttr, type);

        // Create and position the ripple.
        var rect = holder.getBoundingClientRect();
        var x = at.clientX - rect.left;
        var y = at.clientY - rect.top;
        var ripple = document.createElement('div');
        var max;
        if (rect.width === rect.height) {
            max = rect.width * 1.412;
        } else {
            max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        }
        var dim = max * 2 + 'px';
        ripple.style.width = dim;
        ripple.style.height = dim;
        ripple.style.marginLeft = -max + x + 'px';
        ripple.style.marginTop = -max + y + 'px';

        // Activate/add the element.
        ripple.className = 'ripple';
        if (props.opacity) {
            ripple.style.opacity = props.opacity;
        }
        if (props.background) {
            ripple.style.backgroundColor = props.background;
        }
        holder.appendChild(ripple);
        window.setTimeout(function () {
            ripple.classList.add('held');
        }, 0);

        var releaseEvent = (type === 'mousedown' ? 'mouseup' : 'touchend');
        var release = () => {
            // TODO: We don't check for _our_ touch here. Releasing one finger
            // releases all ripples.
            document.removeEventListener(releaseEvent, release);
            ripple.classList.add('done');

            // larger than animation: duration in css
            window.setTimeout(function () {
                if (holder) {
                    holder?.removeChild(ripple);
                    if (!holder.children.length) {
                        cl.remove('active');
                        holder?.removeAttribute(rippleTypeAttr);
                    }
                }
            }, 650);
        };
        document.addEventListener(releaseEvent, release);
        return true;
    }, []);

    useEffect(() => {

        // run stylesetup before add event
        styleSetup();

        const handleMouseDown = (ev: MouseEvent): void => {
            if (ev.button === 0) {
                // trigger on left click only
                startRipple(ev.type, ev);
            }
        }

        const handleTouchStart = (ev: TouchEvent): void => {
            for (var i = 0; i < ev.changedTouches.length; ++i) {
                startRipple(ev.type, ev.changedTouches[i]);
            }
        }

        RippleElementRef.current?.addEventListener('mousedown', handleMouseDown, { passive: true });
        RippleElementRef.current?.addEventListener('touchstart', handleTouchStart, { passive: true });

        return () => {
            RippleElementRef.current?.removeEventListener('mousedown', handleMouseDown);
            RippleElementRef.current?.removeEventListener('touchstart', handleTouchStart);
        }
    }, []);

    return (
        <div {...props} style={{ position: 'relative', ...props.style }} ref={RippleElementRef}>
            {props.children}
            <div className={"rippleJS" + (props.fill === true ? " fill" : "")}></div>
        </div>
    )
}
